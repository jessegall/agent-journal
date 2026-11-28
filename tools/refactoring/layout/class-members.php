<?php

declare(strict_types=1);

/*
 * How a class's members are laid out when it has no sections: trait uses, constants, properties, the constructor,
 * public, protected, then private methods. Shared by the merge and the ordering of one class.
 */

use PhpParser\Node;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Property;
use PhpParser\Node\Stmt\TraitUse;

/**
 * A member's text from the start of its first comment's line to its end.
 */
function memberText(string $source, Node $member): string
{
    $start = $member->getComments() === [] ? $member->getStartFilePos() : $member->getComments()[0]->getStartFilePos();
    $start = (int) strrpos(substr($source, 0, $start), "\n") + 1;

    return rtrim(substr($source, $start, $member->getEndFilePos() + 1 - $start));
}

/**
 * Where a member stands in a class laid out without sections.
 */
function memberRank(Node $member): int
{
    return match (true) {
        $member instanceof TraitUse => 0,
        $member instanceof ClassConst => 1,
        $member instanceof Property => 2,
        $member instanceof ClassMethod && $member->name->toLowerString() === '__construct' => 3,
        $member instanceof ClassMethod && $member->isPrivate() => 6,
        $member instanceof ClassMethod && $member->isProtected() => 5,
        default => 4,
    };
}
