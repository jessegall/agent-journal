<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bindings\Plans;

use App\Contracts\Processes\ShellCommandParser;
use Tests\Fixtures\Bindings\Tasks\Contracts\TaskResolver;

abstract class PlanParser implements ShellCommandParser, TaskResolver {}
