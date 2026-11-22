<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

/**
 * A policy that decides on one record. Each concrete class has a public
 * permits(Actor $actor, <its model> $record, AccessType $access): Illuminate\Auth\Access\Response, typed to its own
 * model, which Laravel's Gate calls once the grant is held; registration checks it at boot.
 */
interface RecordPolicy extends Policy {}
