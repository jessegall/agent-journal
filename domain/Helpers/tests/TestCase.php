<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Values\OwnerAuthority;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\HelperLifecycleEntry;
use Domain\Helpers\Values\SessionStartDetails;
use Illuminate\Support\Str;
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
     * An open job of a fresh writing helper of the parent user, on a free purpose of its own.
     */
    protected function openHelperJob(string $parentId = 'parent'): HelperJob
    {
        $parent = $this->actAsUser($parentId);
        $helper = HelperIdentity::create(
            $parent,
            ActorIdentity::of(Agent::create('Helper '.Str::random(6), 'writing-helper', $this->localProject())),
            'writing-helper',
            'writing-helper',
        );
        $purpose = HelperPurpose::findFree($parent, 'writing-helper', 'General work '.Str::random(6));

        return HelperJob::create($helper, $purpose, $parent, 'Fix the test', [], self::sessionStartFor((string) Str::ulid()));
    }

    /**
     * Runs a step of a job's life as the journal does when it hears of the helper's stop or start.
     */
    protected function runLifecycleCommand(Command $command): void
    {
        $this->actAsUser('another');
        $this->app->make(JournalCommands::class)->runAsJournal(CommandEntry::Application, HelperLifecycleEntry::NAME, $command);
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
