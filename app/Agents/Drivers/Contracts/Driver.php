<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Sessions\StartReceipt;
use App\Values\BoundTarget;
use App\Values\DriverRegistration;
use App\Values\StartRequest;
use App\Values\SupportSnapshot;

/**
 * The journal's side of one registered driver: what it is, what it can do on a host, and its start and resume, each
 * accepted in a transaction and answered with a durable receipt while the host does the process work.
 */
interface Driver
{
    /**
     * The driver's registration: its key, family, label, pinned builds and the protocols it speaks.
     */
    public function descriptor(): DriverRegistration;

    /**
     * What the driver supports for the bound target, such as rewriting a command or passing a screen.
     */
    public function capabilities(BoundTarget $target): SupportSnapshot;

    /**
     * Starts the agent in a new session, as the request asks.
     */
    public function start(StartRequest $request): StartReceipt;

    /**
     * Starts the agent again in the session it ran before, as the request asks.
     */
    public function resume(StartRequest $request): StartReceipt;
}
