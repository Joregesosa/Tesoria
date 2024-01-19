<?php

namespace Database\Factories;

use App\Models\Rol;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->email(),
            'email_verified_at' => now(),
            'empresa'  => fake()->name(),
            'rnc'  => fake()->name(),
            'password' => 'admin', 
            'remember_token' => Str::random(10),
            'telefono'=> fake()->phoneNumber(),
 
            'rol_id'=> 1,  

 
//             'rol_id'=> Rol::inRandomOrder()->first()->id,  
 
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
