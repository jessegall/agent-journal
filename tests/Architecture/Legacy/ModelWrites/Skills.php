<?php

declare(strict_types=1);

/**
 * The model methods of Skills that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'Skill::appendRevision' => 7,
    'SkillContextEpoch::advance' => 7,
    'SkillPublication::deliver' => 7,
    'SkillPublication::intendMany' => 7,
    'SkillReceipt::record' => 7,
];
