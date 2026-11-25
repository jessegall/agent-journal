<?php

declare(strict_types=1);

namespace App\Contracts\Domains;

use App\Exceptions\EndpointDeclarationInvalid;
use Illuminate\Routing\Route;

/**
 * Registers a signed controller's route from the declaration of the call it takes, for Core and the domains alike.
 */
interface ApiRegistrar
{
    /**
     * @param  class-string  $controller
     *
     * @throws EndpointDeclarationInvalid
     */
    public function register(string $controller): Route;
}
