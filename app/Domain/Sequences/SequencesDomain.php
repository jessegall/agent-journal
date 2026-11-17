<?php

declare(strict_types=1);

namespace App\Domain\Sequences;

use App\Domain\Contracts\Domain;
use App\Domain\Contracts\RegistersStates;
use App\Domain\Sequences\States\Support\FollowingSequenceStateFactory;
use App\Domain\Sequences\States\Support\FollowingSequenceStateReference;

final class SequencesDomain implements Domain, RegistersStates
{
    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
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
