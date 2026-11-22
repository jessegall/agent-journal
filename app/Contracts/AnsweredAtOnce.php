<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * An event that asks its listeners to fill in an answer while it is dispatched, such as the folders a start needs or
 * the registered state types: it is heard at once, even inside a command, and never held until a commit.
 */
interface AnsweredAtOnce extends Event {}
