class CreatePlaces < ActiveRecord::Migration[7.0]
  def change
    create_table :places do |t|
      t.string :name
      t.decimal :latitude
      t.decimal :longitude

      t.timestamps
    end
  end
end
