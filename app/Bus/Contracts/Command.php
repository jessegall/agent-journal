<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * A write someone asks the journal to make: a small readonly value its one handler carries out.
 *
 * @template TResult
 */
interface Command {}
