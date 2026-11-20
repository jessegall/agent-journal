<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Marks a class as an event: something that happened, which Core, a domain or a module raises and others may listen to.
 */
interface Event {}
