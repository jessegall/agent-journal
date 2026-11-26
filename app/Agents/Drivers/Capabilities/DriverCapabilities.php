<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Capabilities;

use App\Agents\Drivers\Enums\RewriteSupport;
use App\Exceptions\UnsupportedHook;
use App\Stacks\AgentStack;
use App\Stacks\HookAnswer;
use App\Support\Decisions\Decision;
use App\Values\AgentText;

/**
 * What the journal's contract with one driver covers: the reply schema it was written against, the hooks it maps and
 * how it takes a rewrite. The evidence that a driver version was tested is in docs/hooks/driver-capabilities.md.
 */
final readonly class DriverCapabilities
{
    /**
     * @param  list<string>  $hookMethods  the hook methods this adapter maps, such as onShellCommand and onStop
     * @param  bool  $reportsActualModel  whether the driver tells which model actually ran; no pinned build does
     */
    public function __construct(
        public string $driver,
        public string $schemaContract,
        public array $hookMethods,
        public RewriteSupport $rewrites,
        public bool $reportsActualModel = false,
    ) {}

    /**
     * The final answer as this driver can take it: a rewrite it cannot take becomes a refusal on the stack from before
     * the walk.
     */
    public function finalAnswer(HookAnswer $answer, AgentStack $stackBefore): HookAnswer
    {
        if ($this->rewrites->canRewrite() || ! $answer->isRewrite()) {
            return $answer;
        }

        return $answer->replacedBy(Decision::deny(AgentText::of('core.drivers.rewrite_refused')), $stackBefore);
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
