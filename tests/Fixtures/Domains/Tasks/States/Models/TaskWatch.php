<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The record the task-watch fixture's policy guards; no table holds it, since its commands decide on the class.
 */
final class TaskWatch extends Model {}
