<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Bootstrappers\RegisterStates;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesBootstrappers;
use App\Domains\Contracts\ProvidesStates;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\States\Support\FollowingSequenceStateFactory;
use Domain\Sequences\States\Support\FollowingSequenceStateReference;

final class SequencesDomain implements Domain, ProvidesBootstrappers, ProvidesCommands, ProvidesStates
{
    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    public function bootstrappers(): array
    {
        return [LoadMigrations::class, RegisterStates::class];
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return [StartSequence::class];
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }

    public function states(): array
    {
        return [FollowingSequenceStateReference::TYPE_KEY => FollowingSequenceStateFactory::class];
    }
}
