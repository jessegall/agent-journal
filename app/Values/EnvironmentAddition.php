<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What environment parts add to a start or its sign-in probe: variables, inherited host names, folders and the files
 * the host lets the process read, each list in the order the parts added them.
 */
final readonly class EnvironmentAddition
{
    /**
     * @param  list<string>  $variables
     * @param  list<string>  $inherited
     * @param  list<string>  $folders
     * @param  list<string>  $readFiles
     */
    public function __construct(
        public array $variables = [],
        public array $inherited = [],
        public array $folders = [],
        public array $readFiles = [],
    ) {}

    /**
     * This addition followed by the other.
     */
    public function with(self $other): self
    {
        return new self(
            [...$this->variables, ...$other->variables],
            [...$this->inherited, ...$other->inherited],
            [...$this->folders, ...$other->folders],
            [...$this->readFiles, ...$other->readFiles],
        );
    }
}
