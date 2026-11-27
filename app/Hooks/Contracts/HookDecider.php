<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

/**
 * A class that decides what a hook answers: every state, and the few steps of the answer that gate or replace what the
 * states answered. Only a decider makes a hook answer or changes one, and an architecture test refuses any other.
 */
interface HookDecider {}
