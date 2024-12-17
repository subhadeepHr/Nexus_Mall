<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatchReport extends Model
{
    protected $fillable = ['patch_title','patch_slug','patch_month', 'patch_month_id', 'patch_year', 'patch_year_id', 'patch_file_name'];
}
 