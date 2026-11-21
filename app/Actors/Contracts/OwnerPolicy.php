<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * A policy whose every access belongs to the owner: no built-in agent profile is granted any of it.
 */
interface OwnerPolicy extends Policy {}
