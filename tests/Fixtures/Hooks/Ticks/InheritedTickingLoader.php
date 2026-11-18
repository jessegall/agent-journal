<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

/**
 * A state type that ticks only because the loader it extends is marked.
 */
final class InheritedTickingLoader extends TickingLoader {}
