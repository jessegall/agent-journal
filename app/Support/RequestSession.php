<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\AgentCallContext;
use App\Contracts\CurrentSession;
use App\Exceptions\AgentContextMissing;
use Closure;
use PhpOption\Option;

/**
 * The session of a signed agent call and the binding that holds it.
 */
final readonly class RequestSession implements AgentCallContext, CurrentSession
{
    /**
     * @param  Closure(): Option<AgentContext>  $readContext
     * @param  Closure(Option<AgentContext>): void  $installContext
     */
    public function __construct(private Closure $readContext, private Closure $installContext) {}

    public function hasSession(): bool
    {
        return $this->context()->isDefined();
    }

    public function sessionId(): string
    {
        return $this->context()->getOrThrow(AgentContextMissing::forRequest())->sessionId;
    }

    public function context(): Option
    {
        return ($this->readContext)();
    }

    public function within(Option $context, Closure $work): mixed
    {
        $before = $this->context();
        ($this->installContext)($context);

        try {
            return $work();
        } finally {
            ($this->installContext)($before);
        }
    }
}
