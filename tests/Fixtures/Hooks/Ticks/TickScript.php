<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Support\Ticks\TickCommands;
use Closure;
use App\Support\Ticks\TickContext;

/**
 * What the scripted ticking states of a test do: the ticks each subject got, and what a subject's tick answers. A
 * test gives one instance to the container, and every scripted state is made with it.
 */
final class TickScript
{
    /**
     * @var array<string, list<TickContext>>
     */
    public array $ticks = [];

    /**
     * @var array<string, Closure(TickContext): TickCommands> what a subject's tick does; none means it asks for nothing
     */
    public array $scripts = [];

    public function tick(string $subject, TickContext $tick): TickCommands
    {
        $this->ticks[$subject][] = $tick;

        return isset($this->scripts[$subject]) ? ($this->scripts[$subject])($tick) : TickCommands::none();
    }
}
