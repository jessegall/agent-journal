<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Skills;

use App\Contracts\Skills\SkillConditionEvaluator;
use App\Values\ConditionResult;
use App\Values\SkillContext;
use Spatie\LaravelData\Data;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * notes.has-notes: matches an agent that has written at least the given number of notes, read from the module's own
 * notes.
 */
final readonly class HasNotesCondition implements SkillConditionEvaluator
{
    /**
     * @param  HasNotesParameters  $parameters
     */
    public function evaluate(SkillContext $context, Data $parameters): ConditionResult
    {
        $written = Note::query()->ownedBy($context->actor)->count();

        return $written >= $parameters->atLeast
            ? ConditionResult::match('notes-written')
            : ConditionResult::noMatch('too-few-notes');
    }
}
