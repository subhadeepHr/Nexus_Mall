<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class add_user extends Model
{
    //Add user
    protected $table = 'users';
    protected $fillable = ['name','email','role','role_id','password_raw','password','active_status','ip_address','created_at','updated_at'];
}
