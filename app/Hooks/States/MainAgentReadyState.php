<?php

declare(strict_types=1);

namespace App\Hooks\States;

/**
 * The bottom state of a main agent. What a shell line may run is Core's admission to decide, after every frame has
 * answered, so this state adds nothing of its own.
 */
class MainAgentReadyState extends ReadyState {}
