<?php

declare(strict_types=1);

namespace App\Domains\Values;

use App\Domains\Support\AvailableListener;
use App\Domains\Support\FailureLoggingListener;

/**
 * The event listeners ready for the dispatcher.
 */
final readonly class GatedListeners
{
    /**
     * @param  array<string, list<string|AvailableListener|FailureLoggingListener>>  $events
     * @param  array<string, list<string|AvailableListener>>  $required  for the command's transaction, never the
     *                                                                  dispatcher
     */
    public function __construct(public array $events, public array $required = []) {}
}
