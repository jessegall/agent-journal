<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests\Concerns;

use Domain\Plans\Support\OutlinePageAsk;

/**
 * The outline pages a plan reader asks for in its request: phases_after, and phase with tasks_after and revision.
 */
trait ReadsOutlinePages
{
    /**
     * @return array<string, list<string>>
     */
    protected function outlinePageRules(): array
    {
        return [
            'phases_after' => [
                'nullable',
                'integer',
                'min:0',
            ],
            'phase' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'tasks_after' => [
                'nullable',
                'integer',
                'min:0',
            ],
            'revision' => [
                'nullable',
                'integer',
                'min:0',
            ],
        ];
    }

    public function outlinePageAsk(): OutlinePageAsk
    {
        return new OutlinePageAsk(
            phasesAfter: $this->integer('phases_after'),
            phase: $this->filled('phase') ? $this->integer('phase') : null,
            tasksAfter: $this->integer('tasks_after'),
            revision: $this->integer('revision'),
        );
    }
}
