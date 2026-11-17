<?php

declare(strict_types=1);

use App\Domain\DomainServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    FortifyServiceProvider::class,
];
