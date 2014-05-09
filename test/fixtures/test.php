<?php

/**
 * A class with some class.
 *
 * Just keepin it classy.
 *
 * @package foobar
 * @copyright 2014 iVantage Health Analytics, Inc.
 */
class Foobar {

	/**
	 * This is my cat.
	 *
	 * Everybody knows about him.
	 */
	public $cat;

	/**
	 * This is my dog.
	 *
	 * He's a secret to everyone.
	 */
	private $dog;

	/**
	 * Get your groove on.
	 *
	 * Sometimes cat eats fish, sometimes fish eats cat.
	 * This is the way of the world.
	 *
	 * @param {int} $fish The power level of the fish.
	 * @return {string} The reaction of my cat to the fish.
	 */
	public function funky($fish) {
		if($this->cat > $fish) {
			return 'yum';
		}
		return 'oh noes';
	}
}
