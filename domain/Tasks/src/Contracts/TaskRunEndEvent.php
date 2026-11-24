<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

/**
 * A task's run ended: the task finished, was blocked or was cancelled.
 */
interface TaskRunEndEvent extends TaskStateEvent {}
