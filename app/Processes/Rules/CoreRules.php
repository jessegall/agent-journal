<?php

declare(strict_types=1);

namespace App\Processes\Rules;

use App\Processes\Values\CommandRule;

/**
 * Core's built-in command rules, active from the start (doc 21 revision 6, section 6): readers, file tools, network
 * tools, process control, package managers, tests and checks, builds and Git. Wrappers are declared apart, in
 * WrapperRules, because they run a child rather than act alone.
 */
final readonly class CoreRules
{
    public function __construct(
        private ReadingRules $reading = new ReadingRules(),
        private FileRules $files = new FileRules(),
        private NetworkRules $network = new NetworkRules(),
        private ProcessRules $processes = new ProcessRules(),
        private PackageRules $packages = new PackageRules(),
        private CheckRules $checks = new CheckRules(),
        private BuildRules $builds = new BuildRules(),
        private GitRules $git = new GitRules(),
    ) {}

    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        return [
            ...$this->reading->all(),
            ...$this->files->all(),
            ...$this->network->all(),
            ...$this->processes->all(),
            ...$this->packages->all(),
            ...$this->checks->all(),
            ...$this->builds->all(),
            ...$this->git->all(),
        ];
    }
}
