<?php

declare(strict_types=1);

use App\Domain\DomainServiceProvider;
use App\Domain\Hooks\HooksServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    HooksServiceProvider::class,
    FortifyServiceProvider::class,
];
