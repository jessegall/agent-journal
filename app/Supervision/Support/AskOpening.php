<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Support\ActorIdentity;
use App\Records\Support\RecordIdentity;
use App\Supervision\Contracts\AskType;
use App\Supervision\Enums\AskOriginType;
use App\Supervision\Models\Ask;

/**
 * Opens an ask on the requester's route for its type, under the supervisor graph lock; the same submission key
 * finds the ask it opened before. Routing it is the caller's next step.
 */
final readonly class AskOpening
{
    public function __construct(
        private SupervisorRouting $routes,
        private SupervisorGraphLock $graph,
    ) {}

    public function open(
        ActorIdentity $requester,
        AskType $type,
        string $submissionKey,
        string $body,
        RecordIdentity|null $work,
        AskOriginType $origin,
    ): Ask {
        $reference = Ask::newReference();
        $subject = $type->resolver()->resolve($type->subject(), $reference, $work);
        $this->graph->acquire();
        $route = $this->routes->routeFor($requester, $type->key());

        return Ask::submit(
            $reference,
            $requester,
            $type->key(),
            $submissionKey,
            $body,
            $subject,
            $route->target,
            $origin,
        );
    }
}
