<?php

declare(strict_types=1);

namespace Tests\Fixtures\TestDatabaseTraits;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * A test case that refreshes the database through Laravel's own trait, which the test database rule names.
 */
abstract class RefreshingCase extends TestCase
{
    use RefreshDatabase;
}
