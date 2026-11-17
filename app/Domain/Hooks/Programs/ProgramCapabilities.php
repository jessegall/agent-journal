<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

/**
 * What the journal's contract with one program covers: the reply schema it was written against, the hooks it maps and how it takes a rewrite.
 * It records the contract, not a claim that a program version was tested; docs/hooks/program-capabilities.md holds the evidence.
 */
final readonly class ProgramCapabilities
{
    /**
     * @param  list<string>  $hookMethods  the hook methods this adapter maps, such as onShellCommand and onStop
     */
    public function __construct(
        public string $program,
        public string $schemaContract,
        public array $hookMethods,
        public RewriteSupport $rewrites,
    ) {}

    public function supports(string $hookMethod): bool
    {
        return in_array($hookMethod, $this->hookMethods, true);
    }

    public function checkSupports(string $hookMethod): void
    {
        if (! $this->supports($hookMethod)) {
            throw UnsupportedHook::for($this->program, $hookMethod);
        }
    }
}
