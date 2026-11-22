<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Concerns\HasStates;
use App\Contracts\Command;
use App\Contracts\CommandProvider;
use App\Contracts\NativePartProvider;
use App\Contracts\NavigationProvider;
use App\Contracts\PageProvider;
use App\Contracts\PolicyProvider;
use App\Contracts\SkillProvider;
use App\Contracts\StateProvider;
use App\Declarations\ActionRoute;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Enums\AccessType;
use App\Enums\Icon;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Values\PolicyDefinition;
use Domain\Sequences\Http\Controllers\ChangeSequenceController;
use Domain\Sequences\Http\Controllers\DefineSequenceController;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Policies\StoredSequencePolicy;
use Domain\Sequences\Resolvers\NewSequenceResolver;
use Domain\Sequences\Resolvers\SequenceEditorResolver;
use Domain\Sequences\Resolvers\SequenceIndexResolver;
use Domain\Sequences\Resolvers\SequenceRunWindowResolver;
use Domain\Sequences\Resolvers\SequenceWindowResolver;
use Domain\Sequences\Support\Skills\SequencesSkill;
use Domain\Sequences\Support\States\Support\FollowingSequenceStateFactory;
use Domain\Sequences\Support\States\Support\FollowingSequenceStateReference;

final class SequencesDomain extends Domain implements
    CommandProvider,
    NativePartProvider,
    NavigationProvider,
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
                [AccessType::Create, AccessType::Edit],
            ),
            new PolicyDefinition(
                StoredSequencePolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit],
            ),
        ];
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
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

    public function navigation(): array
    {
        return [NavigationItem::page('index', 'Sequences', Icon::Sequence, position: 40)];
    }

    /**
     * The run page, reached by a run's own link, and the Sequences page the sidebar opens.
     */
    public function pages(): array
    {
        return [
            Page::layout('index', 'Sequences', Icon::Sequence, SequenceIndexResolver::class)
                ->at('')
                ->actions(ActionRoute::post('create', DefineSequenceController::class, 'define-sequence')),
            Page::layout('new', 'New sequence', Icon::Sequence, NewSequenceResolver::class)->at('new'),
            Page::layout('edit', 'Edit steps', Icon::Sequence, SequenceEditorResolver::class)->at('{sequence}/edit'),
            Page::layout('sequence', 'Sequence', Icon::Sequence, SequenceWindowResolver::class)
                ->at('{sequence}')
                ->actions(ActionRoute::patch('{sequence}', ChangeSequenceController::class, 'change-sequence')),
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
