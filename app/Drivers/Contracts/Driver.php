<?php

declare(strict_types=1);

namespace App\Drivers\Contracts;

use App\Agents\Support\StartReceipt;
use App\Agents\Values\StartRequest;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\DriverRegistration;
use App\Drivers\Values\SupportSnapshot;

/**
 * The journal's side of one registered driver: what it is, what it can do on a host, and its start and resume, each
 * accepted in a transaction and answered with a durable receipt while the host does the process work.
 */
interface Driver
{
    public function descriptor(): DriverRegistration;

    public function capabilities(BoundTarget $target): SupportSnapshot;

    public function start(StartRequest $request): StartReceipt;

    public function resume(StartRequest $request): StartReceipt;
}
