<?php

namespace App\Http\Controllers;

use App\Models\add_user;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{


    public function get_user(){
        $users_det = DB::table('users')
                  ->select('*')
                  ->get();

        if (count($users_det) > 0) {
            return response()->json([
                'status' => 200,
                'response' => "Records found!",
                'users' => $users_det
            ]);
        }else{
            return response()->json([
                'status' => 201,
                'response' => "No Records found!",
            ]);
        }
    }

    public function get_roles(){
        $roles_det = DB::table('roles_tbl')
                  ->select('*')
                  ->get();

        if (count($roles_det) > 0) {
            return response()->json([
                'status' => 200,
                'response' => "Records found!",
                'roles' => $roles_det
            ]);
        }else{
            return response()->json([
                'status' => 201,
                'response' => "No Records found!",
            ]);
        }
    }


    public function add_user(Request $request){

        $validatedData = $request->validate([
            'user_name' => 'required|string|max:255',
            'user_password' => 'required|string|max:255',
            'user_email' => 'required|string|max:255',
            'user_role' => 'required|numeric|max:2',
        ]);

        $role = DB::table('roles_tbl')
        ->where('id', $validatedData['user_role'])
        ->where('active_status', '1')
        ->first()->role_name;

        $addUser = add_user::create([
            'name' => $validatedData['user_name'],
            'email' => $validatedData['user_email'],
            'role' => $role,
            'role_id' => $validatedData['user_role'],
            'password_raw' => $validatedData['user_password'],
            'password' => Hash::make($validatedData['user_password']),
            'active_status' => '1',
            'ip_address' => '',
            'created_at' =>  ''
        ]);

        return response()->json([
            'message' => 'user added',
            'data' => $addUser,
        ], 201);
    }

    public function get_user_view($id) {

        // Find user by ID
        $user = User::find($id);
        
        // If the user is not found, return a 404 error
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Return user data as JSON response
        return response()->json($user);
        

        // $userView = DB::table('users')
        // ->select('id','name','email','role','role_id')
        // ->where('id', $request->input('id'))
        // ->where('active_status', '1')
        // ->get();

        // if (count($userView) > 0) {
        //     return response()->json([
        //         'status' => 200,
        //         'response' => "Records found!",
        //         'userView' => $userView
        //     ]);
        // }else{
        //     return response()->json([
        //         'status' => 201,
        //         'response' => "No Records found!",
        //     ]);
        // }
    }

    // Update an existing user
    public function update(Request $request, $id)
    {       
            // Validate the request data
            $validator = Validator::make($request->only(['user_name', 'user_email', 'user_role']), [
                'user_name' => 'required|string|max:255',
                'user_email' => 'required|string|email|max:255|unique:users,email,' . $id, // Ensure $id is set correctly
                'user_role' => 'required|exists:roles_tbl,id', // Ensure the role exists in the roles table
            ]);

            // Return validation errors if validation fails
            if ($validator->fails()) {
                Log::error($validator->errors()); // Log validation errors
                return response()->json([
                    'status' => 422,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ]);
            }

            // Fetch the existing user details
            $existingUser = DB::table('users')
                ->where('id', $id)
                ->where('active_status', '1')
                ->first();

            if (!$existingUser) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found or already inactive.',
                ]);
            }

            // Compare incoming data with existing data
            $changes = [];
            if ($request->user_name !== $existingUser->name) {
                $changes['name'] = $request->user_name;
            }
            if ($request->user_email !== $existingUser->email) {
                $changes['email'] = $request->user_email;
            }
            if ($request->user_role != $existingUser->role_id) {
                $roleDetails = DB::table('roles_tbl')
                    ->where('id', $request->user_role)
                    ->value('role_name');
                $changes['role_id'] = $request->user_role;
                $changes['role'] = $roleDetails;
            }

            // If no changes, return a message
            if (empty($changes)) {
                return response()->json([
                    'status' => 200,
                    'message' => 'No changes detected.',
                ]);
            }

            // Perform the update
            $updatedUser = DB::table('users')
                ->where('id', $id)
                ->where('active_status', '1')
                ->update($changes);

            // Check if the update was successful
            if ($updatedUser) {
                return response()->json([
                    'status' => 200,
                    'message' => 'User updated successfully!',
                ]);
            } else {
                return response()->json([
                    'status' => 500,
                    'message' => 'Failed to update the user.',
                ]);
            }
    }

    public function deleteUser($id)
    {
        // Find the user by ID
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.',
            ], 404);
        }

        // Check if the user is active or any other condition
        // if ($user->active_status !== 1) {
        //     return response()->json([
        //         'status' => 400,
        //         'message' => 'Inactive user cannot be deleted.',
        //     ], 400);
        // }

        // Attempt to delete the user
        try {
            $user->delete();
            return response()->json([
                'status' => 200,
                'message' => 'User deleted successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while deleting the user.',
            ], 500);
        }
    }
}
