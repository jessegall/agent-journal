<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bindings\Plans;

use App\Core\Hooks\Contracts\ShellCommandParser;
use Tests\Fixtures\Bindings\Tasks\Contracts\TaskReader;

abstract class PlanParser implements ShellCommandParser, TaskReader {}
