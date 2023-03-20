<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RegistrationController;
// use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'v1'], function(){
    
    Route::group([
    
        'namespace' => 'App\Http\Controllers',
        'prefix' => 'auth',
    
    ], function ($router) {
    
        Route::post('login', 'AuthController@login');
        Route::post('logout', 'AuthController@logout');
        Route::post('refresh', 'AuthController@refresh');
        Route::post('me', 'AuthController@me');
    
    });
    

    Route::post('/signup', [RegistrationController::class, "Register"]);
    Route::post('/getallusers/{var1?}/{var2?}', [UserController::class, "GetAllUsers"]);
    Route::post('/favorite', [UserController::class, "FavoriteUser"]);
    Route::post('/block', [UserController::class, "BlockUser"]);
    Route::post('/message', [UserController::class, "MessageUser"]);
    Route::post('/getallfavorites', [UserController::class, "GetAllFavorites"]);
    Route::post('/getallblocks', [UserController::class, "GetAllBlocks"]);
    Route::post('/getallmessages', [UserController::class, "GetAllMessages"]);
    Route::post('/resetpassword' , [UserController::class, "ResetPassword"]);
});
