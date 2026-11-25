<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Asks\AskType;
use App\Enums\Asks\AskOriginType;
use App\Models\Asks\Ask;
use App\Values\ProfileKey;

/**
 * Opens an ask on the requester's route for its type, under the supervisor graph lock; the same submission key
 * finds the ask it opened before. Routing it is the caller's next step.
 */
final readonly class AskService
{
    public function __construct(
        private SupervisorDefinitions $routes,
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

    /**
     * Opens an ask on the route of a profile, such as the role a review was first sent to, whoever asks now; the ask
     * keeps following that profile's route.
     */
    public function openOnProfile(
        ProfileKey $routeProfile,
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
        $route = $this->routes->routeForProfile($routeProfile, $type->key());

        return Ask::submit(
            $reference,
            $requester,
            $type->key(),
            $submissionKey,
            $body,
            $subject,
            $route->target,
            $origin,
            $routeProfile,
        );
    }
}
