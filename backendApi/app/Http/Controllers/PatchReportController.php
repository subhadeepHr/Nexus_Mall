<?php 
namespace App\Http\Controllers;

use App\Models\PatchReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Validator;

class PatchReportController extends Controller
{
    //months
    public function get_months(){
        $months = DB::table('month_tbl')
                  ->select('id','month_name')
                  ->get();

        if (count($months) > 0) {
            return response()->json([
                'status' => 200,
                'response' => "Records found!",
                'months' => $months
            ]);
        }else{
            return response()->json([
                'status' => 201,
                'response' => "No Records found!",
            ]);
        }
    }

    //Years
    public function get_years(){
        $year = DB::table('year_tbl')
                ->select('id','year')
                ->get();

        if (count($year) > 0) {
            return response()->json([
                'status' => 200,
                'response' => "Records found!",
                'years' => $year
            ]);
        }else{
            return response()->json([
                'status' => 201,
                'response' => "No Records found!",
            ]);
        }
    }

    //Add Patch Report
    public function add_patch_report(Request $request){

        // $request = json_decode(file_get_contents("php://input"));

        $validatedData = $request->validate([
            'patch_report_name' => 'required|string|max:255',
            'patch_report_month' => 'required|numeric',
            'patch_report_year' => 'required|numeric',
            'patch_report_file' => 'required|file|mimes:pdf|max:2048',
        ]);


        $month = DB::table('month_tbl')
                ->where('id', $validatedData['patch_report_month'])
                ->where('active_status', '1')
                ->first()->month_name;

        // dd($month);

        $year = DB::table('year_tbl')
        ->where('id', $validatedData['patch_report_year'])
        ->where('active_status', '1')
        ->first()->year;

        // dd($year);

        $slug = str_replace(' ', '-', strtolower($validatedData['patch_report_name']));
        $pdfFile = $request->file('patch_report_file');
        // var_dump($slug);

        // Handle file upload
        // $filePath = null;
        if ($request->hasFile('patch_report_file')) {
            
            // Store the file and get its path
            // $filePath = $request->file('patch_report_file')->store('patch_reports', 'public');
            $frontendPublicPath = base_path('../public/uploads/patch_reports');

            if (!file_exists($frontendPublicPath)) {
                mkdir($frontendPublicPath, 0755, true);
            }
            
            // Get the full path of the file
            // $oldPath = storage_path('app/public/' . $filePath);
            
            // Define the new file name
            $newFileName = $slug.'_'.$month.'_'. $year.'_'. time().'.'.$pdfFile->getClientOriginalExtension(); // Replace with your desired file name and extension
           
            $pdfFile->move($frontendPublicPath, $newFileName);

           // $newPath = storage_path('app/public/patch_reports/' . $newFileName);

            // Rename the file
            // rename($oldPath, $newPath);
        }

        // Insert data into existing table
        $patchReport = PatchReport::create([
            'patch_title' => $validatedData['patch_report_name'],
            'patch_slug' => $slug,
            'patch_month' => $month,
            'patch_month_id' => $validatedData['patch_report_month'],
            'patch_year' => $year,
            'patch_year_id' => $validatedData['patch_report_year'],
            'patch_file_name' => $newFileName ?? null
        ]);

        return response()->json([
            'message' => 'Patch report uploaded successfully!',
            'data' => $patchReport,
        ], 201);
    }


    public function get_patch_report_data(Request $request){

        $month = $request->query('month');
        $year = $request->query('year');
        $page = $request->input('page', 1); // Default to page 1
        $limit = $request->input('limit', 10); // Default to 10 items per page

        if (!$month || !$year) {
            return response()->json(['error' => 'Month and year are required'], 400);
        }

        // Fetch data based on month and year
            $reportData = PatchReport::query();
            if ($month) {
                $reportData->where('patch_month_id', $month);
            }
        
            if ($year) {
                $reportData->where('patch_year_id', $year);
            }
            $paginator = $reportData->paginate($limit, ['*'], 'page', $page);

        // $reportData = PatchReport::where('patch_month_id', $month)
            // ->where('patch_year_id', $year)
            // ->get();
            
        // if (count($reportData) > 0){
             return response()->json([
                'reportData' => $paginator->items(),
                'totalPages' => $paginator->lastPage(),

            // 'status' => 200,
            // 'response' => count($reportData)." Records found!",
            // 'reportData' => $reportData
        ]);
        // }else{
        // return response()->json([
        //     'status' => 201,
        //     'response' => "No Records found!",
        // ]);
        // }
    }
    
}