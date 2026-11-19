<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * A domain's policy for one kind of subject: its authorize method throws when the actor may not do the ability, and
 * its ability methods answer with a bool that never leaves the policy.
 */
interface Policy {}
