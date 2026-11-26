<?php

declare(strict_types=1);

namespace App\Scripts;

use App\Scripts\Values\ParsedHandler;
use App\Scripts\Values\ScriptHandler;
use App\Values\CompiledScript;
use App\Values\ScriptSource;

final readonly class ScriptCompiler
{
    public function __construct(private ScriptKeywordRegistration $keywords, private ScriptObjectRegistration $objects) {}

    /**
     * @param  list<ParsedHandler>  $handlers
     */
    public function compile(ScriptSource $source, array $handlers): CompiledScript
    {
        $graph = new ScriptGraph();
        $handlerEntries = [];

        foreach ($handlers as $handler) {
            $trigger = $handler->trigger;
            $policy = $this->keywords->trigger($trigger)->policy();
            $owner = $this->keywords->get($trigger->token)->owner;

            $graph->remember('trigger:'.$trigger->token, [$owner, $trigger->implementation, $policy]);

            $graph->addTerminal($policy->fallthrough);
            $graph->addTerminal($policy->failure);
            $graph->addTerminal($policy->returnToActor);

            $context = CompileContext::forHandler(
                $this->keywords,
                $this->objects,
                $graph,
                $source->definitions(),
                $policy,
            );

            $handlerEntries[$trigger->token] = new ScriptHandler(
                $context->compileBlock($handler->statements),
                $policy,
                $handler->source,
            );
        }

        return $graph->compiled($handlerEntries, $source->hash());
    }
}
