<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What a node of a script's flowchart stands for: the trigger it starts from, an instruction, a policy step of the
 * trigger, or a terminal.
 */
enum FlowNodeType: string
{
    case Trigger = 'trigger';
    case Instruction = 'instruction';
    case Policy = 'policy';
    case Terminal = 'terminal';
}
