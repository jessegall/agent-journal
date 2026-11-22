<?php

declare(strict_types=1);

namespace Domain\Sequences\Values;

/**
 * One step of a stored sequence as a command carries it: its id, its title, when it runs and when it is done.
 */
final readonly class SequenceStep
{
    public function __construct(
        public string $id,
        public string $title,
        public string $runsWhen,
        public string $doneWhen,
    ) {}

    /**
     * @return array{id: string, title: string, runsWhen: string, doneWhen: string}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'runsWhen' => $this->runsWhen,
            'doneWhen' => $this->doneWhen,
        ];
    }
}
