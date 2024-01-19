<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        User::factory()->create([
 
            'name' => "admin",
            'email' => "joregesosa@gmail.com",
            'email_verified_at' => now(),
            'password' => "admin", 
            'empresa'  => "Tesoria",
            'rnc'  => "402-5175896-8",
            'telefono'=> "8098892235",
            'rol_id'=> 1,  
        ]);

        User::factory()->create([
            'name' => "Cliete Jose",
            'email' => "cliente@gmail.com",
            'email_verified_at' => now(),
            'password' => "cliente", 
            'empresa'  => "Coca Cola",
            'rnc'  => "856-7586985-4",
            'telefono'=> "8098892235",
            'rol_id'=> 2,  
        ]);

        User::factory()->create([
            'name' => "Cliete Pedro",
            'email' => "cliente2@gmail.com",
            'email_verified_at' => now(),
            'password' => "cliente", 
            'empresa'  => "DGI",
            'rnc'  => "856-7586985-4",
            'telefono'=> "8098892235",
            'rol_id'=> 2,  
        ]);
    }
}
