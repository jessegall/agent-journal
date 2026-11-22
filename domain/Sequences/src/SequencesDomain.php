<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Operations\Enums\AccessType;
use App\Skills\Contracts\SkillProvider;
use App\Ui\Contracts\NativePartProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Resolvers\SequenceIndexResolver;
use Domain\Sequences\Resolvers\SequenceRunWindowResolver;
use Domain\Sequences\Skills\SequencesSkill;
use Domain\Sequences\States\Support\FollowingSequenceStateFactory;
use Domain\Sequences\States\Support\FollowingSequenceStateReference;

final class SequencesDomain extends Domain implements
    CommandProvider,
    NativePartProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider,
    StateProvider
{
    use HasStates;

    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                SequencePolicy::class,
                [AccessType::Create],
            ),
        ];
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
     * The native part a declared page mounts to edit the steps of a sequence definition.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['SequenceEditor.vue'];
    }

    /**
     * The run page, reached by a run's own link, and its index address, which only explains that: no sidebar entry,
     * since no list of the runs a reader may see exists.
     */
    public function pages(): array
    {
        return [
            Page::layout('index', 'Sequences', Icon::Activity, SequenceIndexResolver::class)->at(''),
            Page::layout('run', 'Sequence run', Icon::Activity, SequenceRunWindowResolver::class)->at('runs/{run}'),
        ];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function states(): array
    {
        return [FollowingSequenceStateReference::TYPE_KEY => FollowingSequenceStateFactory::class];
    }

    public function skills(): array
    {
        return [SequencesSkill::class];
    }
}
