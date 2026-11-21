<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Drivers\Enums\HookDriver;
use App\Profiles\Support\EligibleAccounts;
use Illuminate\Http\JsonResponse;

/**
 * The accounts a start on this driver may run with, for Home's start and switch forms.
 */
final readonly class EligibleAccountsController
{
    public function __invoke(string $driver, EligibleAccounts $accounts): JsonResponse
    {
        return new JsonResponse($accounts->forDriver(HookDriver::from($driver)));
    }
}
