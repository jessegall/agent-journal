<?php

declare(strict_types=1);

namespace App\Values;

use App\Projects\Exceptions\ProjectReadRefused;

/**
 * The answers to one request for several of a project's folders or files, one per path asked for.
 */
final readonly class ProjectFileAnswers
{
    /**
     * @param  list<ProjectFileAnswer>  $answers
     */
    public function __construct(public array $answers) {}

    /**
     * The answer for a path this request asked for.
     *
     * @throws ProjectReadRefused
     */
    public function of(string $path): ProjectFileAnswer
    {
        foreach ($this->answers as $answer) {
            if ($answer->path === $path) {
                return $answer;
            }
        }

        throw ProjectReadRefused::notAsked($path);
    }
}
