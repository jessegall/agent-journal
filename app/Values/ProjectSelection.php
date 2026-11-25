<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Projects\ProjectSelectionType;
use App\Exceptions\ProjectNotChosen;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The projects a request reads: all of them, one, or none, where none still sees Global records.
 */
final readonly class ProjectSelection
{
    /**
     * @param  Option<string>  $project
     */
    private function __construct(
        public ProjectSelectionType $type,
        private Option $project,
    ) {}

    public static function all(): self
    {
        return new self(ProjectSelectionType::All, None::create());
    }

    public static function none(): self
    {
        return new self(ProjectSelectionType::None, None::create());
    }

    public static function of(string $projectId): self
    {
        return new self(ProjectSelectionType::Project, new Some($projectId));
    }

    /**
     * @throws ProjectNotChosen
     */
    public function projectId(): string
    {
        return $this->project->getOrThrow(ProjectNotChosen::forSelection());
    }

    /**
     * The selection as one word that a search handle or a continuation is bound to: the project id, all or none.
     */
    public function key(): string
    {
        return $this->project->getOrElse($this->type->value);
    }
}
