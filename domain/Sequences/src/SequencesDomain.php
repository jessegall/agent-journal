<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Concerns\HasStates;
use App\Contracts\CommandProvider;
use App\Contracts\NativePartProvider;
use App\Contracts\PageProvider;
use App\Contracts\PolicyProvider;
use App\Contracts\SkillProvider;
use App\Contracts\StateProvider;
use App\Declarations\Page;
use App\Enums\AccessType;
use App\Enums\Icon;
use App\Support\Domain;
use App\Support\Exports;
use App\Values\PolicyDefinition;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Resolvers\SequenceIndexResolver;
use Domain\Sequences\Resolvers\SequenceRunWindowResolver;
use Domain\Sequences\Support\Skills\SequencesSkill;
use Domain\Sequences\Support\States\Support\FollowingSequenceStateFactory;
use Domain\Sequences\Support\States\Support\FollowingSequenceStateReference;

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
        return [StartSequenceCommand::class];
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
