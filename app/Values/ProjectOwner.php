<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\ProjectNotChosen;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Who a record belongs to: one project, or Global, which every project sees and which is no project itself.
 */
final readonly class ProjectOwner
{
    /**
     * The key a Global owner is written as, where a project id would stand.
     */
    public const string GLOBAL_KEY = 'global';

    /**
     * @param  Option<string>  $project
     */
    private function __construct(private Option $project) {}

    public static function ofProject(string $projectId): self
    {
        return new self(new Some($projectId));
    }

    public static function global(): self
    {
        return new self(None::create());
    }

    /**
     * The owner a key names: Global for the Global key, else the project of that id.
     */
    public static function fromKey(string $key): self
    {
        if ($key === self::GLOBAL_KEY) {
            return self::global();
        }

        return self::ofProject($key);
    }

    public function isGlobal(): bool
    {
        return $this->project->isEmpty();
    }

    /**
     * @throws ProjectNotChosen when the owner is Global
     */
    public function projectId(): string
    {
        return $this->project->getOrThrow(ProjectNotChosen::forSelection());
    }

    /**
     * The owner as one word a command carries: the project id, or the Global key.
     */
    public function key(): string
    {
        return $this->project->getOrElse(self::GLOBAL_KEY);
    }

    /**
     * Whether a record of this owner may be joined to one of the other: both of one project, or the other Global.
     */
    public function mayJoin(self $other): bool
    {
        if ($other->isGlobal()) {
            return true;
        }

        return $this->project->filter(fn (string $id): bool => $id === $other->projectId())->isDefined();
    }
}
