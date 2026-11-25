<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests;

use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Agents\ConversationModeType;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Values\OwnerAuthority;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Values\SessionStartDetails;
use Tests\Support\DomainBoot;
use Tests\TestCase as BaseTestCase;

/**
 * The base of every test of the Helpers domain, so what all of them share has one place.
 */
abstract class TestCase extends BaseTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    /**
     * Acts as the user as the owner, the parent whose helper records the test reads and writes.
     */
    protected function actAsUser(string $userId): ActorIdentity
    {
        $actor = ActorContext::forUser($userId);
        $this->app->make(CurrentActorSetter::class)->set($actor, new OwnerAuthority('test'));

        return ActorIdentity::of($actor);
    }

    /**
     * A job started for the request on revision 1 of its profile, on a reused identity in a new conversation.
     */
    protected static function sessionStartFor(string $requestId): SessionStartDetails
    {
        return new SessionStartDetails(
            $requestId,
            hash('sha256', $requestId),
            1,
            false,
            false,
            ConversationModeType::New,
            '',
        );
    }
}
