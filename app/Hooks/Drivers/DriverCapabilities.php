<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;

/**
 * What the journal's contract with one program covers: the reply schema it was written against, the hooks it maps and
 * how it takes a rewrite.
 * It records the contract, not a claim that a program version was tested; docs/hooks/program-capabilities.md holds the
 * evidence.
 */
final readonly class DriverCapabilities
{
    /**
     * @param  list<string>  $hookMethods  the hook methods this adapter maps, such as onShellCommand and onStop
     * @param  bool  $reportsActualModel  whether the program tells which model actually ran; no pinned build does
     */
    public function __construct(
        public string $driver,
        public string $schemaContract,
        public array $hookMethods,
        public RewriteSupport $rewrites,
        public bool $reportsActualModel = false,
    ) {}

    /**
     * The final answer as this program can take it: a rewrite it cannot take becomes a refusal on the stack from before
     * the walk.
     */
    public function finalAnswer(HookAnswer $answer, AgentStack $stackBefore): HookAnswer
    {
        if ($this->rewrites->canRewrite() || ! $answer->isRewrite()) {
            return $answer;
        }

        return $answer->replacedBy(Decision::deny(DriverReplies::REWRITE_REFUSAL), $stackBefore);
    }

    public function supports(string $hookMethod): bool
    {
        return in_array($hookMethod, $this->hookMethods, true);
    }

    public function assertSupports(string $hookMethod): void
    {
        if (! $this->supports($hookMethod)) {
            throw UnsupportedHook::for($this->driver, $hookMethod);
        }
    }
}
